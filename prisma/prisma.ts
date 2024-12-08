import { PrismaClient } from "@prisma/client"

/**
 * Isso declara uma variável global chamada prisma que pode armazenar uma instância do PrismaClient ou ser undefined. 
 * Isso é feito para garantir que apenas uma instância do PrismaClient seja criada e reutilizada durante toda a aplicação.
 */
declare global {
    var prisma: PrismaClient | undefined
}


/**
 * Aqui, é criada uma instância do PrismaClient chamada client. 
 * Se globalThis.prisma já estiver definido (ou seja, se já houver uma instância do PrismaClient), ela será reutilizada. 
 * Caso contrário, uma nova instância será criada.
 */
const client = globalThis.prisma || new PrismaClient()


/**
 * Nesse bloco de código, a instância do PrismaClient é atribuída à variável global prisma apenas se o ambiente não for de produção. 
 * Isso é útil durante o desenvolvimento para facilitar a depuração e o acesso à instância do Prisma.
 */
if(process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client