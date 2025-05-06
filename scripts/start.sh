set -e

echo "Starting the app..."
npm run docker:up

echo "Running DB migrations..."
docker compose exec app npm run migration:run

echo "Seeding categories..."
docker compose exec app npm run seed:categories



