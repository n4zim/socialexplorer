import { DB } from "./database.ts"

DB.registerBot("test1", "Test Bot #1", "This is a test bot")

DB.addFollower("test1", "test2")