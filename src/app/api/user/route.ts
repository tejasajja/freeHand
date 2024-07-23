// import { db } from "@/lib/db";
// import { hash } from "bcrypt";
// import { NextResponse } from "next/server";
// import * as z from 'zod'
// export async function POST(req: Request) {

// const userSchema = z
//   .object({
//     username: z.string().min(1, 'Username is required').max(100),
//     email: z.string().min(1, 'Email is required').email('Invalid email'),
//     password: z
//       .string()
//       .min(1, 'Password is required')
//       .min(8, 'Password must have than 8 characters'),
//   })

//     try {
//         const body = await req.json();
//         console.log('Request body:', body);

//         const { email, username, password } = userSchema.parse(body);

//         const existingUserByEmail = await db.user.findUnique({ where: { email: email } });
//         if (existingUserByEmail) {
//             console.log('User with this email already exists');
//             return NextResponse.json({ user: null, message: 'User with this email already exists' }, { status: 409 });
//         }

//         const existingUserByUsername = await db.user.findUnique({ where: { username: username } });
//         if (existingUserByUsername) {
//             console.log('User with this username already exists');
//             return NextResponse.json({ user: null, message: 'User with this username already exists' }, { status: 409 });
//         }

//         const hashedPassword = await hash(password, 10);
//         console.log('Hashed password:', hashedPassword);

//         const newUser = await db.user.create({
//             data: {
//                 email,
//                 username,
//                 password: hashedPassword
//             }
//         });

//         const {password: newUserPassword, ...rest} = newUser;

//         console.log('New user created:', newUser);
//         return NextResponse.json({ user: newUser, message: 'User created successfully' }, { status: 201 });
//     } catch (error) {
//         console.error('Error occurred:', error);
//         return NextResponse.json({ error: 'An error occurred while creating the user' }, { status: 500 });
//     }
// }