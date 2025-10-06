import { Request, Response, NextFunction } from 'express';
import { items, Item } from '../models/example.model';


// create
export const createItem = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const newItem: Item = { id: Date.now(), text: name };
        items.push(newItem);
        res.status(200).json(newItem);
    } catch (error) {
        next(error);
    }
};

// read all
export const getItems = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(items);
    } catch (error) {
        next(error);
    }
};

// read single item
export const getItemById = (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const item = items.find((i => i.id === id));
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
    } catch (error) { next(error) }
};

// update item 
export const updateItem = (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name: text } = req.body;
        const itemIndex = items.findIndex((i) => i.id === id);
        if (itemIndex === -1) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        items[itemIndex].text = text;
        res.json(items[itemIndex]);
    } catch (error) {
        next(error);
    }
}

// delete item
export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const itemIndex = items.findIndex((i) => i.id === id);
        if (itemIndex === -1) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        const deletedItem = items.splice(itemIndex, 1)[0];
        res.json(deletedItem);
    } catch (error) {
        next(error);
    }
};