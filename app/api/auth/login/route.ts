import { NextResponse } from "next/server";
import { User } from "@/types";
import { userDB } from "@/lib/db";
import { signToken } from "@/utils/jwt";

// POST /api/auth/login - Create a new user
export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const user = userDB
      .getAll()
      .find((user: User) => user.email === userData.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.password !== userData.password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    console.log(user);  

    return NextResponse.json(
      {
        access_token: signToken({
          userId: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
        }),
        name: user.name,
        email: user.email,
        type: user.type,
        userId: user._id,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
