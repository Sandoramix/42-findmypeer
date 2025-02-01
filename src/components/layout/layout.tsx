import { FC, PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (<div className="flex flex-col justify-center h-dvh w-dvw bg-zinc-800 text-neutral-200">
		{children}
	</div>);
};