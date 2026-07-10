const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.egopwhnenqtzyxdfhdql:VCHQV0vfa091bOsA@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
    }
  }
});

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true },
    take: 1
  });
  console.log('--- TOKYO POOLER TEST SUCCESS ---', users);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
