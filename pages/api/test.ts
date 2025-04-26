import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
  time: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ 
    message: 'API正常工作',
    time: new Date().toISOString()
  })
} 