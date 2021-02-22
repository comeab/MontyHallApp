import axios from 'axios';

const BASE_URL = 'http://192.168.0.21:5002';

export const querySimulationEngine = (numberOfSimulations, isSwitching) =>{
    const requestBody ={ numberOfSimulations, isSwitching}
    
    return new Promise((resolve, reject) => axios.post(`${BASE_URL}/Simulation`, JSON.stringify(requestBody), {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        })
        .then((resp) => {
            resolve(resp);
        })
        .catch((e) => reject(e)));
}