export const animationFrame = function(): Promise<void> {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
};

export const animate = function(animator: (tick: number) => void): () => void {
    let stop = false;
    
    (async () => {
        for (let i = 0; !stop; i++) {
            await animationFrame();
            animator(i);
        }
    })();
    
    return () => {
        stop = true;
    };
};