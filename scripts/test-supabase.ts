/**
 * Simple test script to verify Supabase connection
 * Run with: npm run test-db
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');
  
  // Check environment variables
  const dbType = process.env.DATABASE_TYPE;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log(`📊 Database Type: ${dbType || 'sqlite (default)'}`);
  console.log(`🌐 Supabase URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`🔑 Supabase Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}\n`);
  
  if (dbType === 'supabase') {
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase configuration incomplete!');
      console.log('\n🔧 Fix by setting these in .env.local:');
      console.log('DATABASE_TYPE=supabase');
      console.log('NEXT_PUBLIC_SUPABASE_URL=https://telibffpfnttamfvxydz.supabase.co');
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here');
      return;
    }
    
    try {
      // Test Supabase connection
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      console.log('🔄 Testing Supabase connection...');
      
      // Simple health check
      const { data, error } = await supabase
        .from('surveys')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ Supabase connection failed:', error.message);
        console.log('\n🔧 Possible fixes:');
        console.log('1. Check your Supabase URL and API key');
        console.log('2. Run the SQL setup script in Supabase dashboard');
        console.log('3. Verify RLS policies allow public access');
      } else {
        console.log('✅ Supabase connection successful!');
        console.log('✅ Tables are accessible');
        
        // Test if we have data
        const { data: surveyData } = await supabase
          .from('surveys')
          .select('*')
          .limit(5);
        
        console.log(`📊 Found ${surveyData?.length || 0} surveys in database`);
        
        if ((surveyData?.length || 0) === 0) {
          console.log('\n⚠️  No data found. Make sure to run the SQL setup script!');
        }
      }
      
    } catch (error) {
      console.error('❌ Test failed:', error instanceof Error ? error.message : 'Unknown error');
    }
    
  } else {
    console.log('📁 Using SQLite (local database)');
    console.log('\n🔄 To switch to Supabase:');
    console.log('1. Set DATABASE_TYPE=supabase in .env.local');
    console.log('2. Add your Supabase URL and API key');
    console.log('3. Run the SQL setup in Supabase dashboard');
  }
  
  console.log('\n🎯 Next steps:');
  if (dbType === 'supabase') {
    console.log('1. Restart your dev server: npm run dev');
    console.log('2. Test survey submission at http://localhost:3000');
    console.log('3. Check analytics at http://localhost:3000/analytics');
  } else {
    console.log('1. Update .env.local with Supabase credentials');
    console.log('2. Run npm run test-db again');
  }
}

// Run the test
testSupabaseConnection()
  .then(() => {
    console.log('\n✅ Test complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test script failed:', error);
    process.exit(1);
  });