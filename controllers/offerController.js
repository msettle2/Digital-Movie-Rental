const model = require('../models/offer');
const Item = require('../models/item');

exports.makeOffer = (req, res, next)=>{
    let offer = new model(req.body); //create a new offer document
    let id = req.params.id;
    let offerId = req.params.offerId;

    // assign the user and item to a value
    offer.amount = req.body.amount;
    offer.user = req.session.user;
    offer.item = id;

    console.log(req.body.amount);

    offer.save() // insert the item into the database
    .then((offer)=>{
        req.flash('success', 'Offer listing successfully placed');
        res.redirect('/items/'+id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
                err.status = 400;
        }
        next(err);
    });

    Item.findByIdAndUpdate(id, {$inc:{totalOffers: 1}})/* .populate('item') */
    .then(offer=>{
        if(offer){
            /* console.log(offer);
            console.log(req.body.amount); */
        }else{
            let err = new Error ('Cannot find a item with id '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
    console.log(offer);

    Item.findByIdAndUpdate(id, {$max:{highestOffer: req.body.amount}})/* .populate('item') */
    .then(offer=>{
        if(offer){
            /* console.log(offer);
            console.log(req.body.amount); */
        }else{
            let err = new Error ('Cannot find a item with id '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
    console.log(offer);
};

exports.viewOffers = async(req, res, next)=>{
    /* let id = req.params.id;
    res.send(`send the viewOffers view ${id}`) */

    let id = req.params.id;
    /* let offerId = req.params.offerId;
    model.findById(id).populate('user', 'firstName lastName').populate('item', 'title')
    .then(offer=>{
        if(offer){
            console.log(offer);
            res.render('./offers/offers', {offer});
        }else{
            let err = new Error ('Cannot find a offer with id '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err)); */

    try{
        const [offers, items] = await Promise.all([model.find({item: id}).populate('user', 'firstName lastName'), Item.findById(id)]);
        res.render('./offers/offers', {offers, items});
    }catch(err){
        next(err);
    }

    /* try{
        const [items, offers] = await Promise.all([Item.find({seller: req.session.user}), model.find({user: req.session.user}).populate('item')]);
        res.render('./offers/offers', {items, offers});
    }catch(err){
        next(err);
    } */
}

exports.acceptOffer = async (req, res, next)=>{
    let offer = new model(req.body); //create a new offer document
    let id = req.params.id;
    let offerId = req.params.offerid;

    console.log(offerId);
    console.log(id);

    //res.send(`send the viewOffers view ${id}`);

    //console.log(offer.status);
    //offer.status = 'Rejected'
    //Item.active = true;


    //console.log(req.body);
    console.log(offer);
    try{
        await Promise.all([model.findByIdAndUpdate(offerId, {status: 'Accepted'}), model.updateMany({_id: {$ne: offerId}, item: id}, {$set: {"status": 'Rejected'}}), Item.findByIdAndUpdate(id, {active: false})]);
        //console.log(offers.status);
        const [offers, items] = await Promise.all([model.find({item: id}).populate('user', 'firstName lastName'), Item.findById(id)]);
        /* console.log(items);
        console.log(items); */
        
        res.render('./offers/offers', {offers, items});
        //res.redirect('/offers/'+offerId);
    }catch(err){
        next(err);
    }


    /* Item.findByIdAndUpdate(id, {active: false})
    .then(item=>{
        if(item){

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

    model.findByIdAndUpdate(id, {status: 'Accepted'})
    .then(item=>{
        if(item){
            req.flash('success', 'Offer successfully accepted');
            res.redirect('/items/'+id+'/offers');
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
    }); */
}