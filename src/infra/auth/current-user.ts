import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { z } from 'zod'

const tokenPayloadSchema = z.object({
  user: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return { sub : request.decodedData.sub } as UserPayload
  },
)