const camerasTypes = 
[
    {
        id: 0,
        name:"Videoprojector",
        rangeNear: 0.2,
        rangeFar: 50,
        checkedDefault : true,
        recommended: true
    }
];

/*let i = 0;
camerasTypes.forEach(type => {
    type.id = i++;
    type.HFov = Math.round(2 * Math.atan(1 / (2 * type.opticRatio)) * 180 / Math.PI * 100) / 100.0;
    type.VFov = Math.round(2 * Math.atan(1 / (2 * type.opticRatio * type.aspectRatio)) * 180 / Math.PI * 100) / 100.0;
});*/
//camerasTypes.forEach(type => type.aspectRatio = Math.abs(Math.tan((type.HFov/2.0) * Math.PI / 180.0)/Math.tan((type.VFov/2.0) * Math.PI / 180.0)));

const units = {
    meters: {
        value: 1,
        label: 'm',
        squaredLabel: 'm²'
    },
    feets: {
        value: 3.28084,
        label: 'ft',
        squaredLabel: 'sqft'
    }
};


export { units }
export { camerasTypes }