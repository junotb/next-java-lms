# Build stage: Next.js 빌드
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 설치 (캐시 활용, package-lock.json 있으면 npm ci 사용)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit; else npm install --no-audit; fi

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Runtime stage: standalone 출력 사용
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 보안: root가 아닌 사용자로 실행
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

# standalone 출력에서 필요한 파일만 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
