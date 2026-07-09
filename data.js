// Initialize SITE_DATA by fetching and parsing data.json
let SITE_DATA = {
    alerts: { message: "", enabled: false, expiresAt: 0 },
    worlds: []
};

async function loadSiteData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error(`Failed to load data.json: ${response.statusText}`);
        const jsonData = await response.json();
        
        // Merge the loaded data into SITE_DATA
        SITE_DATA = {
            alerts: jsonData.alerts || { message: "", enabled: false, expiresAt: 0 },
            worlds: jsonData.worlds || []
        };
        
        // Check for local overrides
        if (localStorage.getItem("cs_local_data")) {
            try {
                const localData = JSON.parse(localStorage.getItem("cs_local_data"));
                Object.assign(SITE_DATA, localData);
            } catch(e) {
                console.error("Error loading local data override:", e);
            }
        }
        
        console.log("Site data loaded successfully from data.json", SITE_DATA);
    } catch (error) {
        console.error("Error loading data.json:", error);
        // Fallback: keep default empty structure
    }
}

// Auto-load data when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSiteData);
} else {
    loadSiteData();
}
