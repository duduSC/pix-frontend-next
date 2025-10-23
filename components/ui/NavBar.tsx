import Link from "next/link";

export default function MainNavBar(){
    return(
        <>
            <ul>
                <li>
                    <Link href='/'>Home</Link>
                </li>
                <li>
                    <Link href="/users">User</Link>
                </li>
                <li>
                    <Link href="/users/list">List</Link>
                </li>
                <li></li>
            </ul>
        </>
    )
}