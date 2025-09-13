// Test script to verify update drug functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:3100';

// Test data for creating a drug
const testDrug = {
    name: "TestDrug12345", // Must be > 5 characters
    dosage: "10-morning,20-afternoon,30-night", // Must follow format
    card: 2000, // Must be > 1000
    pack: 100, // Must be > 0
    perDay: 50 // Must be > 0 and < 90
};

// Updated test data
const updatedDrug = {
    name: "UpdatedTestDrug12345",
    dosage: "15-morning,25-afternoon,35-night",
    card: 2500,
    pack: 150,
    perDay: 60
};

async function testUpdateFunctionality() {
    try {
        console.log('Testing Drug Update Functionality...\n');

        // Step 1: Create a test drug
        console.log('1. Creating test drug...');
        const createResponse = await axios.post(`${BASE_URL}/api/drugs`, testDrug);
        console.log('✓ Drug created successfully:', createResponse.data.message);
        const drugId = createResponse.data.data._id;
        console.log('   Drug ID:', drugId);

        // Step 2: Update the drug
        console.log('\n2. Updating drug...');
        const updateResponse = await axios.put(`${BASE_URL}/api/drugs/${drugId}`, updatedDrug);
        console.log('✓ Drug updated successfully:', updateResponse.data.message);
        console.log('   Updated data:', updateResponse.data.data);

        // Step 3: Verify the update by fetching the drug
        console.log('\n3. Verifying update...');
        const getResponse = await axios.get(`${BASE_URL}/api/drugs?id=${drugId}`);
        const fetchedDrug = getResponse.data;
        
        // Check if all fields were updated correctly
        const isUpdated = 
            fetchedDrug.name === updatedDrug.name &&
            fetchedDrug.dosage === updatedDrug.dosage &&
            fetchedDrug.card === updatedDrug.card &&
            fetchedDrug.pack === updatedDrug.pack &&
            fetchedDrug.perDay === updatedDrug.perDay;

        if (isUpdated) {
            console.log('✓ Update verification successful!');
            console.log('   All fields match the updated values.');
        } else {
            console.log('✗ Update verification failed!');
            console.log('   Expected:', updatedDrug);
            console.log('   Actual:', fetchedDrug);
        }

        // Step 4: Test validation errors
        console.log('\n4. Testing validation errors...');
        try {
            const invalidDrug = {
                name: "Test", // Too short
                dosage: "invalid-format",
                card: 500, // Too small
                pack: 0, // Invalid
                perDay: 100 // Too large
            };
            
            await axios.put(`${BASE_URL}/api/drugs/${drugId}`, invalidDrug);
            console.log('✗ Validation should have failed but didn\'t');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✓ Validation working correctly - rejected invalid data');
                console.log('   Error message:', error.response.data.message);
            } else {
                console.log('✗ Unexpected error during validation test:', error.message);
            }
        }

        // Step 5: Clean up - delete the test drug
        console.log('\n5. Cleaning up...');
        const deleteResponse = await axios.delete(`${BASE_URL}/api/drugs/${drugId}`);
        console.log('✓ Test drug deleted:', deleteResponse.data.message);

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Response status:', error.response.status);
            console.error('   Response data:', error.response.data);
        }
    }
}

// Run the test
testUpdateFunctionality();
