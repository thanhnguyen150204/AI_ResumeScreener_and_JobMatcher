import { extractText, getDocumentProxy } from 'unpdf';
import groqClient from '../config/groq.js';
import prisma from '../config/prisma.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const callAI = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await groqClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });
      return response.choices[0].message.content;
    } catch (err) {
      if (err?.status === 429 && i < retries - 1) {
        const waitSec = (i + 1) * 10;
        console.log(`Rate limited. Retrying in ${waitSec}s... (${i + 1}/${retries})`);
        await sleep(waitSec * 1000);
        continue;
      }
      throw err;
    }
  }
};

const buildAnalysisPrompt = (cvText, jdText) => `
You are an expert ATS (Applicant Tracking System) analyst and professional career coach.
Your task is to analyze how well a candidate's CV matches a given Job Description.

Follow this chain of thought:
1. Extract key requirements from the JD (skills, experience, qualifications)
2. Map each requirement to evidence in the CV
3. Identify gaps and missing keywords
4. Calculate an objective match score
5. Generate actionable improvement suggestions

---
JOB DESCRIPTION:
${jdText}

---
CANDIDATE CV:
${cvText}

---
Return ONLY a valid JSON object with this EXACT structure (no markdown, no extra text):
{
  "matchScore": <integer 0-100>,
  "summary": "<2-3 sentence objective assessment of fit>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "suggestions": {
    "summary": "<rewritten professional summary optimized for this JD and ATS>",
    "skills": "<suggested skills section with missing keywords added>",
    "experience": "<3 specific tips to rewrite experience bullets with impact metrics>"
  },
  "atsOptimizationTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}
`;

export const analyzeResumeService = async ({ cvBuffer, cvFileName, jdText, userId }) => {
  const pdf = await getDocumentProxy(new Uint8Array(cvBuffer));
  const { text } = await extractText(pdf, { mergePages: true });
  const cvText = text.trim();

  if (!cvText || cvText.length < 50) {
    throw new Error('Không thể đọc nội dung từ file PDF. Vui lòng kiểm tra file CV.');
  }

  const prompt = buildAnalysisPrompt(cvText, jdText);
  const rawContent = await callAI(prompt);

  let analysisResult;
  try {
    const cleaned = rawContent.replace(/```json\n?|\n?```/g, '').trim();
    analysisResult = JSON.parse(cleaned);
  } catch {
    throw new Error('AI trả về kết quả không hợp lệ. Vui lòng thử lại.');
  }

  const analysis = await prisma.resumeAnalysis.create({
    data: {
      userId,
      cvFileName,
      cvText,
      jdText,
      matchScore: analysisResult.matchScore,
      missingKeywords: analysisResult.missingKeywords || [],
      suggestions: analysisResult,
    },
  });

  return { id: analysis.id, ...analysisResult };
};

export const getHistoryService = async (userId) => {
  return prisma.resumeAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      cvFileName: true,
      matchScore: true,
      missingKeywords: true,
      createdAt: true,
    },
  });
};

export const getAnalysisDetailService = async (id, userId) => {
  const analysis = await prisma.resumeAnalysis.findFirst({
    where: { id: Number(id), userId },
  });
  if (!analysis) throw new Error('Không tìm thấy kết quả phân tích');
  return analysis;
};

export const bulkRankService = async ({ cvBuffers, jdText }) => {
  const results = [];

  for (const { buffer, filename } of cvBuffers) {
    try {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const { text } = await extractText(pdf, { mergePages: true });
      const cvText = text.trim();

      if (!cvText || cvText.length < 50) {
        results.push({ filename, error: 'Không đọc được nội dung PDF', matchScore: 0 });
        continue;
      }

      const prompt = buildAnalysisPrompt(cvText, jdText);
      const rawContent = await callAI(prompt);
      const cleaned = rawContent.replace(/```json\n?|\n?```/g, '').trim();
      const result = JSON.parse(cleaned);

      results.push({
        filename,
        matchScore: result.matchScore,
        summary: result.summary,
        strengths: result.strengths,
        missingKeywords: result.missingKeywords,
      });
    } catch (err) {
      results.push({ filename, error: err.message, matchScore: 0 });
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
};
