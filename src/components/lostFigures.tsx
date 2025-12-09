import type { Figure } from "../models/figures/figure";

interface LostFiguresProps {
  title: string;
  figures: Figure[];
}

export default function LostFigures({ title, figures }: LostFiguresProps) {
  return (
    <div className="p-4 w-48 ml-10 rounded-xl bg-gray-800/80 shadow-lg text-white backdrop-blur">
      <h3 className="font-semibold text-lg mb-3 text-center border-b border-gray-600 pb-2">
        {title}
      </h3>

      <div className="space-y-2">
        {figures.length === 0 && (
          <p className="text-sm text-gray-400 text-center">Нет фигур</p>
        )}

        {figures.map((figure) => (
          <div
            key={figure.id}
            className="flex items-center gap-3 bg-gray-700/40 px-2 py-1 rounded-lg shadow"
          >
            {figure.logo && (
              <img
                className="w-6 h-6 select-none"
                src={figure.logo}
                alt={figure.name}
              />
            )}
            <span className="capitalize text-sm">{figure.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
