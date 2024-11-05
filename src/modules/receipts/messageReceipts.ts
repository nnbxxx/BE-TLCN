export const renderOrderCancelDueToExpiration = (orderId: string): string => {
    return `Your order with code "${orderId}" has been cancelled. Because online payment on VNPay is overdue.`;
}

export const renderOrderCancelDueToUser = (orderId: string): string => {
    return `Your order with code "${orderId}" has been successfully canceled.`;
}

export const renderOrderCancelDueToAdmin = (orderId: string): string => {
    return `Your order with code "${orderId}" has been cancelled. For some reason by Admin`;
}