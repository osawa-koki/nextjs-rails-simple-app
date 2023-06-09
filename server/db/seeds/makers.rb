require "csv"

csv_path = Rails.root.join("db", "data", "makers.csv")

CSV.parse(File.read(csv_path), headers: true).each do |row|
  Maker.find_or_create_by(id: row["id"]) do |maker|
    maker.id = row["id"]
    maker.name = row["name"]
    maker.country = row["country"]
    maker.founding_date = row["founding_date"]
  end
end
