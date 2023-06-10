class Api::MakerController < ApplicationController
  def index
    page = params[:page].presence || 1
    @makers = Maker.order(id: :asc).page(page)
    render json: {
      makers: @makers,
      pagination: {
        current_page: @makers.current_page,
        next_page: @makers.next_page,
        prev_page: @makers.prev_page,
        total_pages: @makers.total_pages,
        total_count: @makers.total_count
      }
    }
  end

  def create
    @maker = Maker.new(maker_params)
    unless @maker.valid?
      render json: {
        message: 'Validation Failed.'
      }, status: :unprocessable_entity
      return
    end

    if @maker.save
      render json: @maker
    else
      render json: @maker.errors
    end
  end

  def update
    @maker = Maker.find(params[:id])
    if @maker.update(maker_params)
      render json: @maker
    else
      render json: @maker.errors, status: :not_found
    end
  end

  def destroy
    if params[:id] == '-1'
      Maker.destroy_all
      render json: { message: 'All makers are deleted.' }
      return
    end
    @maker = Maker.find(params[:id])
    @maker.destroy
    render json: @maker
  end

  def maker_params
    params.permit(:name, :country, :founding_date)
  end
end
