class Api::MerchandiseController < ApplicationController
  def index
    page = params[:page].presence || 1
    @merchandises = Merchandise.order(id: :asc).page(page).includes(:maker)
    render json: {
      merchandises: @merchandises,
      pagination: {
        current_page: @merchandises.current_page,
        next_page: @merchandises.next_page,
        prev_page: @merchandises.prev_page,
        total_pages: @merchandises.total_pages,
        total_count: @merchandises.total_count
      }
    }
  end

  def create
    @merchandise = Merchandise.new(merchandise_params)
    unless @merchandise.valid?
      render json: {
        message: 'Validation Failed.'
      }, status: :unprocessable_entity
      return
    end

    if @merchandise.save
      render json: @merchandise
    else
      render json: @merchandise.errors
    end
  end

  def update
    @merchandise = Merchandise.find(params[:id])
    if @merchandise.update(merchandise_params)
      render json: @merchandise
    else
      render json: @merchandise.errors, status: :not_found
    end
  end

  def destroy
    if params[:id] == '-1'
      Merchandise.destroy_all
      render json: { message: 'All merchandises are deleted.' }
      return
    end
    @merchandise = Merchandise.find(params[:id])
    @merchandise.destroy
    render json: @merchandise
  end

  def merchandise_params
    params.permit(:name, :price, :description, :is_available, :maker_id)
  end
end
