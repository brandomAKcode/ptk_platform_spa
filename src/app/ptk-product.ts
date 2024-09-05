export interface PTKProduct {
    id: number,
    quantity: number,
    inventary: number,
    product: number
}

export const PTKProductsList: { [key: number]: { name: string, product_type: string, img: string } } = {
    1: { name: 'Pegatanke Epoxico Economico',  product_type: 'EPO', img: 'img/products/pegatanke_.png' },
    2: { name: 'Pegatanke Epoxico Negro',  product_type: 'EPO', img: 'img/products/pegatanke_epoxi_black.png' },
    3: { name: 'Pegatanke Epoxico Blanco',  product_type: 'EPO', img: 'img/products/pegatanke_epoxi_white.png' },
    4: { name: 'Pegatanke Epoxico Acero',  product_type: 'EPO', img: 'img/products/pegatanke_epoxi_steel.png' },
    5: { name: 'Pegatanke Epoxy Transparente',  product_type: 'GLU', img: 'img/products/pegatanke_epoxi_transparent.png' },
    6: { name: 'Pegatanke PVC/CPV 25ml',  product_type: 'GLU', img: 'img/products/pegatanke_.png' },
    7: { name: 'Pegatanke PVC/CPV 80ml',  product_type: 'GLU', img: 'img/products/pegatanke_.png' },
    8: { name: 'Pegatanke PVC/CPV 118ml',  product_type: 'GLU', img: 'img/products/petakanke_pvccpvc_118ml.png' },
    9: { name: 'Pegatanke PVC/CPV 240ml',  product_type: 'GLU', img: 'img/products/pegatanke_pvccpvc_240ml.png' },
    10: { name: 'Pegatanke PVC/CPV 475ml',  product_type: 'GLU', img: 'img/products/pegatanke_pvccpvc_475ml.png' },
    11: { name: 'Pegatanke Teipe',  product_type: 'TAP', img: 'img/products/pegatanke_teipe.png' },
    12: { name: 'Pegatanke Masilla',  product_type: 'PUT', img: 'img/products/pegatanke_masilla.png' },
    13: { name: 'Pegatanke Sellamotor',  product_type: 'SIL', img: 'img/products/pegatanke_sellamotor.png' },
    14: { name: 'Pegatanke Toke',  product_type: 'CYA', img: 'img/products/pegatanke_toke.png' }
}

  