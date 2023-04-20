import stock from './stock/index.mjs';

const expressRouter = (app) => {
    app.use('/stock', stock)
};

export default expressRouter;
