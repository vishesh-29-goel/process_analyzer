/**
 * Calculation engine for Process Evaluation
 * Handles the logic for converting raw metrics into annual dollar values.
 */

export const calculateImpact = (metric, settings = {}) => {
    const hourlyRate = parseFloat(settings.hourly_rate || 45);
    const errorCost = parseFloat(settings.error_cost || 150);

    const baseline = parseFloat(metric.baseline) || 0;
    const target = parseFloat(metric.target) || 0;
    const diff = Math.max(0, baseline - target);

    let annualValue = 0;

    switch (metric.type) {
        case 'labor':
            // diff is in hours per week/month? Let's assume input is annual hours saved or scaled by frequency
            // For simplicity, we'll assume the 'unit' and frequency are handled before calling this, 
            // or we pass frequency here.
            annualValue = diff * hourlyRate;
            break;
        case 'error':
            annualValue = diff * errorCost;
            break;
        case 'financial':
            annualValue = diff; // Direct dollar savings
            break;
        default:
            annualValue = diff;
    }

    return Math.round(annualValue);
};

export const getProcessTotals = (impactData) => {
    if (!impactData) return 0;

    const financial = (impactData.financial || []).reduce((sum, m) => sum + (parseFloat(m.value) || 0), 0);
    const efficiency = (impactData.efficiency || []).reduce((sum, m) => sum + (parseFloat(m.value) || 0), 0);
    const accuracy = (impactData.accuracy || []).reduce((sum, m) => sum + (parseFloat(m.value) || 0), 0);

    return financial + efficiency + accuracy;
};
