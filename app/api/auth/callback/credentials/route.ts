// This route should be deleted - NextAuth v5 handles all callbacks through [...nextauth]
// But since we can't delete it right now, we'll forward to the proper handler
import { handlers } from "@/auth"

export const runtime = "nodejs";

export const { GET, POST } = handlers