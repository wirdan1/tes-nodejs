import axios from "axios";

// --- OPENAPI METADATA ---
export const openapi = {
  path: "/api/downloader/tiktokdl",
  method: "get",
  summary: "TikTok Video Downloader",
  description: "Download TikTok video tanpa watermark. Support HD.",
  tags: ["Downloader Sosmed"],
  parameters: [
    {
      name: "url",
      in: "query",
      description: "Paste link video TikTok",
      required: true,
      schema: {
        type: "string",
        example: "https://vt.tiktok.com/ZSjunPJbq"
      }
    }
  ],
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: {
              code: 0,
              msg: "success",
              data: {
                id: "7301234567890123456",
                title: "Video keren banget!",
                author: {
                  unique_id: "user_cool",
                  nickname: "User Keren"
                },
                video_url: "https://example.com/video.mp4",
                hd_video_url: "https://example.com/video_hd.mp4"
              }
            }
          }
        }
      }
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: { error: "URL parameter is required" }
          }
        }
      }
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: { error: "Failed to fetch TikTok data" }
          }
        }
      }
    }
  }
};

// --- API HANDLER ---
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" }); // ← diperbaiki: q.msg.qUrl → string biasa
  }

  try {
    const result = await tiktokDl(url);

    if (result.code !== 0) { // ← tikwm biasanya pakai `code: 0` untuk sukses
      return res.status(500).json({
        error: result.msg || "Failed to process TikTok URL"
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("TikTok DL Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// --- CORE FUNCTION ---
async function tiktokDl(url) {
  try {
    // ✅ FIX: Hapus spasi di akhir URL!
    const response = await axios.post(
      "https://www.tikwm.com/api", // ← fix: "api " → "api"
      {},
      {
        params: {
          url: url,
          count: 12,
          cursor: 0,
          web: 1,
          hd: 1,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || "Request failed");
  }
}
