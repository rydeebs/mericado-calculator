import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Here you would typically validate the user's credentials
    // For this example, we're using a simple check
    const { username, password } = req.body

    if (username === "admin" && password === "password") {
      // Set a secure HTTP-only cookie
      res.setHeader("Set-Cookie", "auth_token=your_secure_token_here; HttpOnly; Secure; SameSite=Strict; Path=/")
      res.status(200).json({ message: "Authentication successful" })
    } else {
      res.status(401).json({ message: "Authentication failed" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

