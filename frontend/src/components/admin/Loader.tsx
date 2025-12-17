export default function Loader() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-500/30 rounded-full"></div>
                <div className="w-12 h-12 border-4 border-t-blue-500 rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
        </div>
    );
}
