// MongoDB initialization script for Test Flow AI
db = db.getSiblingDB('testflow_ai');

// Create collections with validation
db.createCollection('testsuites', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['id', 'name', 'author'],
            properties: {
                id: { bsonType: 'string' },
                name: { bsonType: 'string', maxLength: 100 },
                description: { bsonType: 'string', maxLength: 500 },
                testCount: { bsonType: 'int', minimum: 0 },
                status: { enum: ['active', 'inactive'] },
                author: { bsonType: 'string' }
            }
        }
    }
});

db.createCollection('tests', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['id', 'testId', 'suiteId', 'name', 'author', 'appUrl', 'feature'],
            properties: {
                id: { bsonType: 'string' },
                testId: { bsonType: 'string' },
                suiteId: { bsonType: 'string' },
                name: { bsonType: 'string', maxLength: 200 },
                priority: { enum: ['low', 'medium', 'high', 'critical'] },
                browser: { enum: ['chrome', 'firefox', 'safari', 'edge'] },
                timeout: { bsonType: 'int', minimum: 1000, maximum: 300000 },
                status: { enum: ['draft', 'ready', 'running', 'passed', 'failed'] },
                author: { bsonType: 'string' },
                appUrl: { bsonType: 'string' },
                feature: { bsonType: 'string' }
            }
        }
    }
});

db.createCollection('testruns', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['id', 'testId', 'suiteId', 'status', 'summary', 'author'],
            properties: {
                id: { bsonType: 'string' },
                testId: { bsonType: 'string' },
                suiteId: { bsonType: 'string' },
                status: { enum: ['running', 'passed', 'failed', 'skipped', 'error'] },
                executionTimeMs: { bsonType: 'int', minimum: 0 },
                author: { bsonType: 'string' }
            }
        }
    }
});

// Create indexes for better performance
db.testsuites.createIndex({ id: 1 }, { unique: true });
db.testsuites.createIndex({ name: 1 });
db.testsuites.createIndex({ status: 1 });
db.testsuites.createIndex({ author: 1 });
db.testsuites.createIndex({ createdAt: -1 });

db.tests.createIndex({ id: 1 }, { unique: true });
db.tests.createIndex({ testId: 1 }, { unique: true });
db.tests.createIndex({ suiteId: 1 });
db.tests.createIndex({ name: 1 });
db.tests.createIndex({ tags: 1 });
db.tests.createIndex({ priority: 1 });
db.tests.createIndex({ status: 1 });
db.tests.createIndex({ author: 1 });
db.tests.createIndex({ createdAt: -1 });

db.testruns.createIndex({ id: 1 }, { unique: true });
db.testruns.createIndex({ testId: 1 });
db.testruns.createIndex({ suiteId: 1 });
db.testruns.createIndex({ status: 1 });
db.testruns.createIndex({ author: 1 });
db.testruns.createIndex({ createdAt: -1 });
db.testruns.createIndex({ startTimestamp: -1 });

print('Test Flow AI database initialized successfully!');
