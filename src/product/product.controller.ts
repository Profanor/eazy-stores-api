import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Products')
@Controller({
  version: '1',
  path: 'products',
})
@UseGuards(ThrottlerGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Create a new product
  @Post('create')
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  // Get all products with pagination
  @Get()
  findAll() {
    return this.productService.getProducts();
  }

  // Search products by name (case-insensitive, partial match)
  @Get('search')
  search(@Query('name') name: string) {
    if (!name) {
      throw new BadRequestException('Name query parameter is required');
    }
    return this.productService.searchProducts(name);
  }

  // Filter products by category and price range
  @Get('filter')
  filter(
    @Query('category') category: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ) {
    return this.productService.filterProducts(category, minPrice, maxPrice);
  }

  // Sort products by a field (e.g., price, name)
  @Get('sorted')
  sort(@Query('sortBy') sortBy: string, @Query('order') order: 'asc' | 'desc') {
    return this.productService.getProductsSorted(sortBy, order);
  }

  // Get a single product
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.getProduct(id);
  }

  // Update an existing product
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct({ id, ...updateProductDto });
  }

  // Delete a product by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.deleteProduct({ id });
  }
}
