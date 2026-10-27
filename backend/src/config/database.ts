import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { broadcastRealtimeChange } from "./socket";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/schoolhub";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter }).$extends({
	query: {
		$allModels: {
			async $allOperations({ model, operation, args, query }: any) {
				const result = await query(args);
				const mutationOperations = new Set(["create", "createMany", "update", "updateMany", "upsert", "delete", "deleteMany"]);

				if (mutationOperations.has(operation)) {
					const recordId = result && typeof result === "object" && "id" in result ? result.id : undefined;
					broadcastRealtimeChange({ entity: model, operation, recordId });
				}

				return result;
			},
		},
	},
});

export default prisma;
