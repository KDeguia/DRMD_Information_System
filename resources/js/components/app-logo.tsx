export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md">
                <img
                    src="/dswd.png" // path to your image in the public folder
                    alt="DSWD Logo" // alternative text for accessibility
                    className="h-full w-full object-contain" // makes it fit the container
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">DRMD IS</span>
            </div>
        </>
    );
}
