class CreateMerchandises < ActiveRecord::Migration[7.0]
  def change
    create_table :merchandises do |t|
      t.string :name, null: false, index: { unique: true }
      t.integer :price, null: false
      t.string :description, null: false
      t.boolean :is_available, null: false, default: true
      t.references :maker, null: false, foreign_key: true
      t.timestamps
    end
  end
end
