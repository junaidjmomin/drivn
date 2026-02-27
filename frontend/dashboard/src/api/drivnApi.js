import axios from 'axios';

let BASE = 'http://localhost:5000';

export function setBaseUrl(url) {
    BASE = url;
}

export function getBaseUrl() {
    return BASE;
}

export const health = () => axios.get(`${BASE}/health`);
export const predict = (data) => axios.post(`${BASE}/predict`, data);
export const modelInfo = () => axios.get(`${BASE}/model-info`);
export const batchPredict = (arr) => axios.post(`${BASE}/batch-predict`, { readings: arr });
