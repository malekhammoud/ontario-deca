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
                             ); \
                         """
    cursor.execute(create_table_query)

def insert_student(cursor, name, email, school):
    """Insert a single student record"""
    insert_query = """
                   INSERT INTO students (name, email, school)
                   VALUES (%s, %s, %s)
                       ON CONFLICT (email) DO UPDATE SET
                       name = EXCLUDED.name,
                                                  school = EXCLUDED.school; \
                   """
    cursor.execute(insert_query, (name, email, school))

def detect_csv_format(file_path, sample_size=5):
    """Detect the CSV format by examining the first few lines"""
    with open(file_path, 'r', encoding='utf-8') as file:
        # Read first few lines to detect delimiter
        sample = file.read(1024)
        file.seek(0)

        # Try different delimiters
        delimiters = [',', '\t', ';', '|']
        best_delimiter = ','
        max_columns = 0

        for delimiter in delimiters:
            file.seek(0)
            reader = csv.reader(file, delimiter=delimiter)
            try:
                first_row = next(reader)
                if len(first_row) > max_columns:
                    max_columns = len(first_row)
                    best_delimiter = delimiter
            except:
                continue

        file.seek(0)
        return best_delimiter

def main():
    start_time = time.time()
    print(f"Starting import at {time.strftime('%Y-%m-%d %H:%M:%S')}")

    # Get database URL from environment
    database_url = os.getenv('DATABASE_URL')

    if not database_url:
        print("Error: DATABASE_URL not found in environment variables")
        print("Make sure your .env file contains DATABASE_URL=your_connection_string")
        return

    csv_file_path = '/home/mhammoud/Downloads/OntarioDECA-Students.csv'

    # Check if CSV file exists
    if not os.path.exists(csv_file_path):
        print(f"Error: CSV file not found at {csv_file_path}")
        return

    conn = None
    cursor = None

    try:
        # Connect to database
        print("Connecting to database...")
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        print(f"Connected in {time.time() - start_time:.2f}s")

        # Create table if it doesn't exist
        create_table_if_not_exists(cursor)
        conn.commit()  # Commit table creation
        print("Table created/verified")

        # Detect CSV format
        delimiter = detect_csv_format(csv_file_path)
        print(f"Detected CSV delimiter: '{delimiter}'")

        # Read CSV and insert data
        csv_start_time = time.time()
        print("Starting CSV processing...")

        with open(csv_file_path, 'r', encoding='utf-8') as file:
            # First, let's see what headers are available
            csv_reader = csv.DictReader(file, delimiter=delimiter)
            headers = csv_reader.fieldnames
            print(f"Available CSV headers: {headers}")

            # Try to map headers to our expected columns
            name_col = None
            email_col = None
            school_col = None

            # Look for name column (case insensitive)
            for header in headers:
                header_lower = header.lower().strip()
                if 'name' in header_lower:
                    name_col = header
                    break

            # Look for email column
            for header in headers:
                header_lower = header.lower().strip()
                if 'email' in header_lower or 'mail' in header_lower:
                    email_col = header
                    break

            # Look for school column
            for header in headers:
                header_lower = header.lower().strip()
                if 'school' in header_lower:
                    school_col = header
                    break

            if not all([name_col, email_col, school_col]):
                print(f"Error: Could not find required columns.")
                print(f"Found - Name: {name_col}, Email: {email_col}, School: {school_col}")
                print("Please check your CSV headers match the expected format")
                return

            print(f"Using columns - Name: '{name_col}', Email: '{email_col}', School: '{school_col}'")

            success_count = 0
            error_count = 0

            # Reset file pointer to beginning
            file.seek(0)
            csv_reader = csv.DictReader(file, delimiter=delimiter)

            for row_num, row in enumerate(csv_reader, 1):
                try:
                    # Get values and handle potential None/empty values
                    name = row.get(name_col, '').strip() if row.get(name_col) else ''
                    email = row.get(email_col, '').strip() if row.get(email_col) else ''
                    school = row.get(school_col, '').strip() if row.get(school_col) else ''

                    # Skip empty rows
                    if not name or not email or not school:
                        print(f"Skipping row {row_num}: missing required data (Name: '{name}', Email: '{email}', School: '{school}')")
                        error_count += 1
                        continue

                    insert_student(cursor, name, email, school)
                    success_count += 1

                    # Print progress every 100 records
                    if row_num % 100 == 0:
                        elapsed = time.time() - csv_start_time
                        rate = row_num / elapsed
                        print(f"Processed {row_num} records in {elapsed:.2f}s ({rate:.2f} records/sec)")

                except KeyError as e:
                    error_count += 1
                    print(f"Error processing row {row_num} - Missing column {e}: {row}")
                except Exception as e:
                    error_count += 1
                    print(f"Error processing row {row_num}: {e}")
                    print(f"Row data: {row}")

        # Commit changes
        print("Committing changes...")
        commit_start = time.time()
        conn.commit()
        commit_time = time.time() - commit_start

        total_time = time.time() - start_time
        print(f"\nCompleted: {success_count} students added, {error_count} errors")
        print(f"Commit took: {commit_time:.2f}s")
        print(f"Total execution time: {total_time:.2f}s")

        # Verify data was inserted
        cursor.execute("SELECT COUNT(*) FROM students;")
        total_records = cursor.fetchone()[0]
        print(f"Total records in database: {total_records}")

    except FileNotFoundError:
        print(f"Error: CSV file not found at {csv_file_path}")
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        if conn:
            conn.rollback()
    except Exception as e:
        print(f"Unexpected error: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("Database connection closed")

if __name__ == "__main__":
    main()