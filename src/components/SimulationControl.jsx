import { useState, useEffect } from 'react'

const SimulationControl = () => {
    const [simulationData, setSimulationData] = useState([]);
    const [params, setParams] = useState({
        mean_speed: 7,
        amplitude: 4,
        period_minutes: 60,
        noise_level: 1,
        rated_power: 5700,
        power_factor: 0.95
    })

    useEffect(() => {
        const interval = setInterval(() => {
            fetchSimulationStatus();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchSimulationStatus = async () => {
        const response = await fetch('http://localhost:8000/simulator/status') ?? {}
        const status = await response.json();
        setSimulationData(prev => [...prev.slice(-29), status]);
    };

    const updateParams = async () => {
        await fetch('http://localhost:8000/simulator/params', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
    };

    return (
        <div className='p-6'>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold mb-4'>Wind turbine simulator control</h1>
                <div className='grid grid-cols-2 gap-4 mb-6'>
                    {Object.entries(params).map(([key, value]) => (
                        <div key={key} className='flex flex-col space-y-2 bg-white p-4 rounded shadow-sm'>
                            <label className='text-gray-700 font-medium'>
                                {key.replace(/_/g, ' ').toUpperCase()}
                            </label>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setParams(prev => ({
                                    ...prev,
                                    [key]: parseFloat(e.target.value)
                                }))}
                                className='p-2 border rounded'
                            />
                        </div>
                    ))}
                    <button
                        onClick={updateParams}
                        className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Update parameters
                    </button>
                </div>

                {simulationData.length > 0 && (
                    <div className='mt-6'>
                        <h2 className='text-xl font-bold mb-4'>Realtime data</h2>
                        <LineChart width={800} height={400} data={simulationData}>
                            
                        </LineChart>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SimulationControl