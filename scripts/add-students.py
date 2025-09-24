import csv
import os
import psycopg2
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_table_if_not_exists(cursor):
    """Create the students table if it doesn't exist"""
    create_table_query = """
    CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        school VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    cursor.execute(create_table_query)

def insert_student(cursor, name, email, school):
    """Insert a single student record"""
    insert_query = """
    INSERT INTO students (name, email, school)
    VALUES (%s, %s, %s)
    ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        school = EXCLUDED.school;
    """
    cursor.execute(insert_query, (name, email, school))

def main():
    start_time = time.time()
    print(f"Starting import at {time.strftime('%Y-%m-%d %H:%M:%S')}")

    # Get database URL from environment
    database_url = os.getenv('DATABASE_URL')

    if not database_url:
        print("Error: DATABASE_URL not found in environment variables")
        return

    try:
        # Connect to database
        print("Connecting to database...")
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        print(f"Connected in {time.time() - start_time:.2f}s")

        # Create table if it doesn't exist
        create_table_if_not_exists(cursor)
        print("Table created/verified")

        # Read CSV and insert data
        csv_start_time = time.time()
        print("Starting CSV processing...")

        with open('/home/mhammoud/Downloads/OntarioDECA-Students.csv', 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file, delimiter='\t')

            success_count = 0
            error_count = 0

            for row_num, row in enumerate(csv_reader, 1):
                try:
                    name = row['Name'].strip()
                    email = row['Email Address'].strip()
                    school = row['school'].strip()

                    insert_student(cursor, name, email, school)
                    success_count += 1

                    # Print progress every 100 records
                    if row_num % 100 == 0:
                        elapsed = time.time() - csv_start_time
                        rate = row_num / elapsed
                        print(f"Processed {row_num} records in {elapsed:.2f}s ({rate:.2f} records/sec)")

                except Exception as e:
                    error_count += 1
                    print(f"Error processing row {row_num} {row}: {e}")

        # Commit changes
        print("Committing changes...")
        commit_start = time.time()
        conn.commit()
        commit_time = time.time() - commit_start

        total_time = time.time() - start_time
        print(f"\nCompleted: {success_count} students added, {error_count} errors")
        print(f"Commit took: {commit_time:.2f}s")
        print(f"Total execution time: {total_time:.2f}s")

    except FileNotFoundError:
        print("Error: students.csv file not found")
    except Exception as e:
        print(f"Database error: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()