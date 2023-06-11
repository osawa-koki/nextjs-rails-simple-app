require "csv"

csv_path = Rails.root.join("db", "data", "merchandises.csv")

CSV.parse(File.read(csv_path), headers: true).each do |row|
  Merchandise.find_or_create_by(id: row["id"]) do |merchandise|
    merchandise.id = row["id"]
    merchandise.name = row["name"]
    merchandise.price = row["price"].to_i
    merchandise.description = row["description"]
    merchandise.is_available = row["is_available"].to_i
    merchandise.maker_id = row["maker_id"].to_i
  end
end
