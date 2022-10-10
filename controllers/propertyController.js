const adminPanel = (request, response) => {
    response.render("properties/adminPanel", {
        page: "Mis propiedades",
        navbar: true,
    });
}

export {
    adminPanel,
}