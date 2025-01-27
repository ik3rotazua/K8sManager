export enum EpLeafletActionButtonAction {
    /**
     * Opens google maps on given coords.
     * coords will be mandatory.
     */
    OPEN_MAPS_COORDS = 'OPEN_MAPS_COORDS',
    /**
     * Locates the user with geolocation and then opens the location on google maps.
     * coords will be ignored.
     */
    OPEN_MAPS_ME = 'OPEN_MAPS_ME',
    /**
     * Opens google maps to navigate from the user's current position to given coords
     * coords will be mandatory.
     */
    OPEN_MAPS_COORDS_NAVIGATE = 'OPEN_MAPS_COORDS_NAVIGATE',
    /**
     * Ignores default functionality and calls the button.callback method.
     */
    CUSTOM_ACTION = 'CUSTOM_ACTION',
}