export function ProgressBar({ current, total }: { current: number; total: number }) {
    const percentage = Math.round((current / total) * 100)

    return (
        <div className="w-full">
            <div className="flex justify-between text-xs font-semibold text-teal-700 mb-1">
                <span>Seu Progresso</span>
                <span>{percentage}%</span>
            </div>
            <div className="w-full bg-teal-100 rounded-full h-2.5 overflow-hidden">
                <div
                    className="bg-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    )
}
