import type { FC, PropsWithChildren } from "react";

export const BaseLayout:FC<PropsWithChildren> = ({children})=>{

	return <main className="w-dvw h-dvh flex flex-col bg-blue-950">
		<header>

		</header>
		<main className="grow flex flex-col w-full">
			{children}
		</main>
		<footer>

		</footer>
	</main>
}