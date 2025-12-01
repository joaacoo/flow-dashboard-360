import { useState, useEffect } from 'react';
import { Sun, Moon, CloudSun } from 'lucide-react';

const Greeting = ({ userName }) => {
    const [greeting, setGreeting] = useState('');
    const [Icon, setIcon] = useState(Sun);

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();

            if (hour >= 6 && hour < 12) {
                setGreeting('¡Buenos días');
                setIcon(Sun);
            } else if (hour >= 12 && hour < 20) {
                setGreeting('¡Buenas tardes');
                setIcon(CloudSun);
            } else {
                setGreeting('¡Buenas noches');
                setIcon(Moon);
            }
        };

        updateGreeting();
        // Actualizar cada minuto por si cambia el turno mientras está abierto
        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <span>{greeting}, <span className="text-[#3091c6]">{userName}</span>!</span>
                <Icon className={`w-8 h-8 ${greeting.includes('días') ? 'text-yellow-500' :
                        greeting.includes('tardes') ? 'text-orange-400' : 'text-blue-400'
                    }`} />
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
                Aquí tienes el resumen de hoy
            </p>
        </div>
    );
};

export default Greeting;
