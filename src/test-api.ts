import { api } from './utils/api';
import { enrichTransfers } from './utils/enrichTransfers';

async function testAPI() {
  console.log('🧪 Testing QFTools API...');
  
  try {
    // Test stats endpoint
    console.log('\n📊 Testing /stats...');
    const stats = await api.getStats();
    console.log('Stats:', stats);
    
    // Test accounts endpoint
    console.log('\n👥 Testing /accounts...');
    const accounts = await api.getAccounts(10);
    console.log('Accounts count:', accounts.count);
    console.log('First account:', accounts.accounts[0]);
    
    // Test transfers endpoint
    console.log('\n💸 Testing /txs...');
    const transfers = await api.getTransfers(10);
    console.log('Transfers count:', transfers.transfers.count);
    console.log('First transfer:', transfers.transfers.items[0]);
    
    // Test enrichTransfers utility
    console.log('\n🔥 Testing enrichTransfers...');
    const enriched = enrichTransfers(transfers.transfers.items);
    console.log('Enriched transfers:', enriched.length);
    console.log('QFPay transfers:', enriched.filter(t => t.isQFPayTransfer).length);
    
    // Test a specific account
    if (accounts.accounts[0]) {
      console.log('\n🔍 Testing account lookup...');
      const account = await api.getAccount(accounts.accounts[0].address);
      console.log('Account detail:', account);
    }
    
    // Test gas (should error gracefully)
    console.log('\n⛽ Testing /gas...');
    const gas = await api.getGas();
    console.log('Gas data:', gas);
    
    // Test tokens (should error gracefully)
    console.log('\n🪙 Testing /tokens...');
    const tokens = await api.getTokens();
    console.log('Token data:', tokens);
    
    console.log('\n✅ API test completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Export for manual testing in browser console
export { testAPI };

// Auto-run in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Uncomment to auto-run: testAPI();
  console.log('🧪 API test ready. Run testAPI() in console to test.');
}
