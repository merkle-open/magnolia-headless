package com.merkle.oss.magnolia.headless.configuration;

import info.magnolia.objectfactory.guice.AbstractGuiceComponentConfigurer;

import com.google.inject.multibindings.Multibinder;
import com.merkle.oss.magnolia.headless.api.dynamicresponseheader.DynamicResponseHeaderProvider;
import com.merkle.oss.magnolia.headless.api.page.mapper.PagePathMapper;
import com.merkle.oss.magnolia.headless.api.sitemap.SitemapProvider;

public class HeadlessGuiceComponentConfigurer extends AbstractGuiceComponentConfigurer {

	@Override
	protected void configure() {
		super.configure();
		Multibinder.newSetBinder(binder(), PagePathMapper.class);
		Multibinder.newSetBinder(binder(), SitemapProvider.class);
		Multibinder.newSetBinder(binder(), DynamicResponseHeaderProvider.class);
	}
}
