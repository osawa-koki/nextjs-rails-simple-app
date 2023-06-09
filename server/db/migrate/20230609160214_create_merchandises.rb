class CreateMerchandises < ActiveRecord::Migration[7.0]
  def change
    create_table :merchandises do |t|
      t.string :name
      t.integer :price
      t.string :description
      t.boolean :is_available

      t.timestamps
    end
  end
end
