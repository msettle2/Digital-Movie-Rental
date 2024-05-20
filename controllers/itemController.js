const model = require('../models/item');
const Offer = require('../models/offer');

exports.index = (req, res, next)=>{
    //res.send('send all items');
    //res.send(model.find());
    let items;

    if(req.query.search){
        // TODO: REFACTOR THIS, TALK TO TA/PROF
        //items = model.search(req.query.search);
        console.log(req.query.search);
        //model.find({title: {$regex: /req.query.search/, $options: 'i' }})console.log(model.find({$title: {$regex: /req.query.search/, $options: 'i' }}));
        model.find({$or: [{title: {$regex: req.query.search, $options: 'i' }},
                          {details: {$regex: req.query.search, $options: 'i' }}]})
        .sort({ price: 'asc'})
        .then(items=>res.render('./template/items', {items}))
        .catch(err=>next(err));
        
    }else{
        /* model.sort((p1, p2) => (p1.price > p2.price) ? 1 : (p1.price < p2.price) ? -1 : 0)
        .then(items=>res.render('./template/items', {items}))
        .catch(err=>next(err)); */
        model.find()
        .sort({ price: 'asc'})
        .then(items=>res.render('./template/items', {items}))
        .catch(err=>next(err));
    }    
};

//GET /items/new: send html form for creating a new item

exports.new = (req, res)=>{
    //res.send('send the new form');
    res.render('./template/new');
};

//POST /items: create a new story

exports.create = (req, res, next)=>{
        let item = new model(req.body); //create a new item document
        if(req.file)
            item.image = '/images/' + req.file.filename;
        item.seller = req.session.user;
        item.totalOffers = 0;
        item.active = true;

        item.save() // insert the item into the database

        .then((item)=>{
            console.log(item);
            req.flash('success', 'Item listing successfully created');
            res.redirect('/items');
        })
        .catch(err=>{
            if(err.name === 'ValidationError'){
                err.status = 400;
            }
            next(err);
        });
};

//GET /items/:id: send details of item identified by id

exports.show = (req, res, next)=>{
    let id = req.params.id;
    // an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    console.log(id);
    console.log(Offer);
    //Offer.findByIdAndDelete({item: id}, {useFindAndModify: false})
    

    //console.log(Offer.findById('662aa999b1176bf8902af4be'));
    //console.log(model.findById(id));
    model.findById(id).populate('seller', 'firstName lastName')
    .then(item=>{
        if(item){
            //console.log(item);
            res.render('./template/item', {item});
        }else{
            let err = new Error ('Cannot find a item with id '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//GET /items/:id/edit: send html form for editing an existing item
exports.edit = (req, res)=>{
    //res.send('send the edit form')
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(item=>{
        if(item){
            res.render('./template/edit', {item});
        }else{
            let err = new Error ('Cannot find a item with id '+id);
            err.status = 400;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//PUT items/:id: update the story identified by id
exports.update = (req, res, next)=>{
    //res.send('update story with id ' + req.params.id);
    // TODO: figure out why req.body doesn't return the updated info
    let item = req.body;
    let id = req.params.id;

    item.image = '/images/' + req.file.filename;
    console.log(item);

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    

    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item=>{
        if(item){
            req.flash('success', 'Item listing successfully updated');
            res.redirect('/items/'+id);
        }else{
            let err = new Error ('Cannot find a item with id '+id);
            err.status = 404;
            next(err);  
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};

//DELETE /stories/:id, delete the story identified by id
exports.delete = (req, res, next)=>{
    //res.send('update story with id ' + req.params.id);
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    Offer.deleteMany({item: id})
    .then(function () {
        // Success
        console.log("Data deleted");
        console.log({item: id});
    }).catch(
        function (error) {
            // Failure
            console.log(error);
    });

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(item=> {
        if(item){
            req.flash('success', 'Item listing successfully deleted');
            res.redirect('/items');
        }else{
            let err = new Error ('Cannot find a item with id '+id);
            err.status = 404;
            next(err);  
        }
    })
    .catch(err=>next(err));
};

exports.search = (req, res)=>{
    res.send('searched for item');
}