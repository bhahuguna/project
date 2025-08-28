const axios = require('axios');

class GeocodingService {
    constructor() {
        this.apiKey = process.env.MAP_TOKEN;
        this.baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    }

    async getCoordinates(address) {
        try {
            if (!address || address.trim() === '') {
                throw new Error('Address is required');
            }

            const response = await axios.get(this.baseUrl, {
                params: {
                    address: address,
                    key: this.apiKey
                }
            });

            if (response.data.status === 'OK' && response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                return {
                    latitude: location.lat,
                    longitude: location.lng,
                    formattedAddress: response.data.results[0].formatted_address
                };
            } else {
                console.warn(`Geocoding failed for address: ${address}. Status: ${response.data.status}`);
                // Return default coordinates (you can change these to your preferred default location)
                return {
                    latitude: 0,
                    longitude: 0,
                    formattedAddress: address
                };
            }
        } catch (error) {
            console.error('Geocoding error:', error.message);
            // Return default coordinates on error
            return {
                latitude: 0,
                longitude: 0,
                formattedAddress: address
            };
        }
    }

    async reverseGeocode(latitude, longitude) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    latlng: `${latitude},${longitude}`,
                    key: this.apiKey
                }
            });

            if (response.data.status === 'OK' && response.data.results.length > 0) {
                return response.data.results[0].formatted_address;
            } else {
                return `${latitude}, ${longitude}`;
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error.message);
            return `${latitude}, ${longitude}`;
        }
    }
}

module.exports = new GeocodingService();
